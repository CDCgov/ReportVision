import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { SaveTemplate } from "./SaveTemplate";
import { AnnotationProvider } from "../contexts/AnnotationContext";
import { FilesProvider } from "../contexts/FilesContext";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../utils/functions", () => ({
  makeScreenshots: vi.fn(() => Promise.resolve(["screenshot1", "screenshot2"])),
}));

describe("SaveTemplate Component", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value;
        },
        clear() {
          store = {};
        },
        removeItem(key: string) {
          delete store[key];
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });
  it("should render the SaveTemplate page with all elements", () => {
    render(
      <BrowserRouter>
        <FilesProvider>
          <AnnotationProvider>
            <SaveTemplate />
          </AnnotationProvider>
        </FilesProvider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("save-template-title")).toBeInTheDocument();
    expect(screen.getByTestId("save-template-title")).toHaveTextContent(
      "Save segmentation as a template",
    );

    expect(
      screen.getByTestId("segmentation-template-name-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("segmentation-template-facility-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("segmentation-template-condition-input"),
    ).toBeInTheDocument();
  });

  it("should navigate back when the back button is clicked", () => {
    render(
      <BrowserRouter>
        <FilesProvider>
          <AnnotationProvider>
            <SaveTemplate />
          </AnnotationProvider>
        </FilesProvider>
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText(/back/i));

    expect(mockNavigate).toHaveBeenCalledWith("/new-template/annotate");
  });

  it("should navigate to the home page when the form is submitted", async () => {
    localStorage.setItem("images", JSON.stringify([]));
    render(
      <BrowserRouter>
        <FilesProvider>
          <AnnotationProvider>
            <SaveTemplate />
          </AnnotationProvider>
        </FilesProvider>
      </BrowserRouter>,
    );

    const nameInput =   screen.getByTestId("segmentation-template-name-input");
    const facilityInput = screen.getByTestId("segmentation-template-facility-input");
    const conditionInput = screen.getByTestId("segmentation-template-condition-input");

    fireEvent.change(nameInput, { target: { value: "Template 1" } });
    fireEvent.change(facilityInput, { target: { value: "Facility 1" } });
    fireEvent.change(conditionInput, { target: { value: "Condition 1" } });

    await act(async () => {
      fireEvent.click(screen.getByText(/submit/i));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

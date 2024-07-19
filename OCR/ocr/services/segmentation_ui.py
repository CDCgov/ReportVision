import sys
import json
import random
from PyQt5.QtWidgets import (
    QApplication,
    QMainWindow,
    QFileDialog,
    QVBoxLayout,
    QHBoxLayout,
    QWidget,
    QPushButton,
    QLabel,
    QInputDialog,
    QGraphicsView,
    QGraphicsScene,
    QGraphicsRectItem,
)
from PyQt5.QtGui import QPixmap, QPainter, QColor, QPen, QBrush, QKeyEvent
from PyQt5.QtCore import Qt, QRectF


class ImageViewer(QGraphicsView):
    """
    This class provides functions for loading images, zooming, panning,
    and drawing colored boxes on the image. It's designed for
    segmenting images for OCR.

    Variables:
        scene (QGraphicsScene): Holds image and relevant actions
        pixmap_item (QGraphicsPixmapItem): The item that displays the loaded image.
        boxes (list): A list of dictionaries containing information about the boxes
        current_rect (QGraphicsRectItem): The box being drawn
        start_pos (QPointF): The starting position of the current box being drawn.

    Methods:
        setImage(pixmap): Set a new image to be displayed.
        wheelEvent(event): Handle mouse wheel events for zooming.
        mousePressEvent(event): Handle mouse press events for drawing boxes.
        mouseMoveEvent(event): Handle mouse move events for drawing boxes.
        mouseReleaseEvent(event): Handle mouse release events for finalizing boxes.
        keyPressEvent(event): Handle key press events for navigation and zooming.
    """

    def __init__(self):
        super().__init__()
        self.scene = QGraphicsScene(self)
        self.setScene(self.scene)
        self.pixmap_item = None
        self.boxes = []
        self.current_rect = None
        self.start_pos = None
        self.setRenderHint(QPainter.Antialiasing)
        self.setRenderHint(QPainter.SmoothPixmapTransform)
        self.setDragMode(QGraphicsView.ScrollHandDrag)
        self.setTransformationAnchor(QGraphicsView.AnchorUnderMouse)
        self.setResizeAnchor(QGraphicsView.AnchorUnderMouse)

        self.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOn)
        self.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOn)

        self.setViewportUpdateMode(QGraphicsView.FullViewportUpdate)

    def setImage(self, pixmap):
        if self.pixmap_item:
            self.scene.removeItem(self.pixmap_item)
        self.pixmap_item = self.scene.addPixmap(pixmap)
        self.setSceneRect(self.pixmap_item.boundingRect())
        self.fitInView(self.sceneRect(), Qt.KeepAspectRatio)

    def wheelEvent(self, event):
        # zooming with Ctrl + Scroll
        if event.modifiers() & Qt.ControlModifier:
            zoom_factor = 1.15
            if event.angleDelta().y() > 0:
                self.scale(zoom_factor, zoom_factor)
            else:
                self.scale(1 / zoom_factor, 1 / zoom_factor)
        else:
            super().wheelEvent(event)

    def keyPressEvent(self, event: QKeyEvent):
        """Handle key press events for navigation and zooming."""
        match event.key():
            case Qt.Key_Plus if event.modifiers() & Qt.ControlModifier:
                self.scale(1.15, 1.15)
            case Qt.Key_Minus if event.modifiers() & Qt.ControlModifier:
                self.scale(1 / 1.15, 1 / 1.15)
            case Qt.Key_Up:
                self.verticalScrollBar().setValue(self.verticalScrollBar().value() - 20)
            case Qt.Key_Down:
                self.verticalScrollBar().setValue(self.verticalScrollBar().value() + 20)
            case Qt.Key_Left:
                self.horizontalScrollBar().setValue(self.horizontalScrollBar().value() - 20)
            case Qt.Key_Right:
                self.horizontalScrollBar().setValue(self.horizontalScrollBar().value() + 20)
            case _:
                super().keyPressEvent(event)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.start_pos = self.mapToScene(event.pos())
            self.current_rect = QGraphicsRectItem()
            color = QColor(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
            self.current_rect.setBrush(QBrush(color))
            self.current_rect.setPen(QPen(Qt.NoPen))
            self.scene.addItem(self.current_rect)
        else:
            super().mousePressEvent(event)

    def mouseMoveEvent(self, event):
        if self.current_rect:
            end_pos = self.mapToScene(event.pos())
            rect = QRectF(self.start_pos, end_pos).normalized()
            self.current_rect.setRect(rect)
        else:
            super().mouseMoveEvent(event)

    def mouseReleaseEvent(self, event):
        if self.current_rect:
            end_pos = self.mapToScene(event.pos())
            rect = QRectF(self.start_pos, end_pos).normalized()
            self.current_rect.setRect(rect)

            key, ok = QInputDialog.getText(self, "Input", "Enter key for this section:")
            if ok and key:
                self.boxes.append(
                    {"rect": self.current_rect, "color": self.current_rect.brush().color().getRgb()[:3], "key": key}
                )
            else:
                self.scene.removeItem(self.current_rect)

            self.current_rect = None
            self.start_pos = None
        else:
            super().mouseReleaseEvent(event)


class MainWindow(QMainWindow):
    """
    This class sets up the UI, including the image viewer
    and control buttons.

    Variables:
        image_viewer (ImageViewer): The custom image viewer widget.

    Methods:
        initUI(): create UI components.
        openImage(): Open an image file and display it in the image viewer.
        save(): Save the segmented image and labels to files.
    """

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("OCR Segmentation Tool")
        self.setGeometry(100, 100, 800, 600)

        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        layout = QVBoxLayout()
        main_widget.setLayout(layout)

        self.image_viewer = ImageViewer()
        layout.addWidget(self.image_viewer)

        button_layout = QHBoxLayout()
        layout.addLayout(button_layout)

        open_button = QPushButton("Open Image")
        open_button.clicked.connect(self.openImage)
        button_layout.addWidget(open_button)

        save_button = QPushButton("Save")
        save_button.clicked.connect(self.save)
        button_layout.addWidget(save_button)

        instructions = QLabel("Hotkeys: Ctrl++ (Zoom In), Ctrl+- (Zoom Out), Arrow Keys (Scroll)")
        layout.addWidget(instructions)

    def openImage(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "Open Image", "", "Image Files (*.png *.jpg *.bmp)")
        if file_name:
            pixmap = QPixmap(file_name)
            self.image_viewer.setImage(pixmap)

    def save(self):
        image_file, _ = QFileDialog.getSaveFileName(self, "Save Image", "", "Image Files (*.png *.jpg *.bmp)")
        if image_file:
            pixmap = QPixmap(self.image_viewer.sceneRect().size().toSize())
            pixmap.fill(Qt.white)
            painter = QPainter(pixmap)
            self.image_viewer.scene.render(painter)
            painter.end()
            pixmap.save(image_file)

        labels_file, _ = QFileDialog.getSaveFileName(self, "Save Labels", "", "JSON Files (*.json)")
        if labels_file:
            labels = {
                f"{box['color'][0]},{box['color'][1]},{box['color'][2]}": box["key"]
                for box in self.image_viewer.boxes
            }
            with open(labels_file, "w") as f:
                json.dump(labels, f)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    sys.exit(app.exec_())

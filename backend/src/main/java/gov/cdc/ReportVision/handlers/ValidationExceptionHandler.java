package gov.cdc.ReportVision.handlers;

import jakarta.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ValidationExceptionHandler {
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<?> handlerException(ConstraintViolationException e) {
    final List<Object> errors = new ArrayList<>();
    e.getConstraintViolations()
        .forEach(
            fieldError -> {
              Map<String, Object> error = new HashMap<>();
              error.put("path", String.valueOf(fieldError.getPropertyPath()));
              error.put("message", fieldError.getMessage());
              errors.add(error);
            });
    HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
    Map<String, Object> body = Map.of("error", errors);
    return new ResponseEntity<>(body, httpStatus);
  }
}

package pl.tawjihi.scholarships.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.tawjihi.scholarships.dto.ContactRequest;
import pl.tawjihi.scholarships.entity.ContactMessage;
import pl.tawjihi.scholarships.service.ContactService;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService service;

    @PostMapping
    public ResponseEntity<Void> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        service.submit(message);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}

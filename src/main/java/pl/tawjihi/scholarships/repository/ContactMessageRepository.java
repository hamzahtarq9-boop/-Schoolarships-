package pl.tawjihi.scholarships.repository;

import pl.tawjihi.scholarships.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}

package pl.tawjihi.scholarships.repository;

import pl.tawjihi.scholarships.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long>, JpaSpecificationExecutor<Scholarship> {
}

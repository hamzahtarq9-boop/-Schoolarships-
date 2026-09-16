package pl.tawjihi.scholarships.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "scholarships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String university;
    private String country;

    @Column(name = "degree_level")
    private String degreeLevel; // Bachelor / Master / PhD

    @Column(name = "coverage_type")
    private String coverageType; // Fully Funded / Partial

    private LocalDate deadline;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(length = 4000)
    private String criteria;

    @Column(length = 4000)
    private String benefits;

    @Column(name = "apply_url")
    private String applyUrl;

    private boolean featured = false;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}

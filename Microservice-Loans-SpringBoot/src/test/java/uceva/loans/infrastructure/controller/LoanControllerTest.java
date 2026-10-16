package uceva.loans.infrastructure.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uceva.loans.application.usecase.CreateLoanUseCase;
import uceva.loans.application.usecase.GetLoanByIdUseCase;
import uceva.loans.application.usecase.ListLoansUseCase;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.domain.exception.InvalidLoanException;
import uceva.loans.domain.exception.LoanNotFoundException;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LoanControllerTest {

    private MockMvc mockMvc;
    private ListLoansUseCase listLoansUseCase;
    private GetLoanByIdUseCase getLoanByIdUseCase;
    private CreateLoanUseCase createLoanUseCase;
    private final Loan loan = new Loan(1, "Rayuela", "Ana",
            LocalDate.of(2026, 10, 15), LocalDate.of(2026, 11, 15), LoanStatus.ACTIVE);

    @BeforeEach
    void setUp() {
        listLoansUseCase = mock(ListLoansUseCase.class);
        getLoanByIdUseCase = mock(GetLoanByIdUseCase.class);
        createLoanUseCase = mock(CreateLoanUseCase.class);
        LoanController controller = new LoanController(listLoansUseCase, getLoanByIdUseCase, createLoanUseCase);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldListLoans() throws Exception {
        when(listLoansUseCase.execute()).thenReturn(List.of(loan));

        mockMvc.perform(get("/loans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].bookTitle").value("Rayuela"))
                .andExpect(jsonPath("$[0].memberName").value("Ana"))
                .andExpect(jsonPath("$[0].loanDate").value("2026-10-15"))
                .andExpect(jsonPath("$[0].dueDate").value("2026-11-15"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    void shouldGetLoanById() throws Exception {
        when(getLoanByIdUseCase.execute(1)).thenReturn(loan);

        mockMvc.perform(get("/loans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookTitle").value("Rayuela"));
    }

    @Test
    void shouldReturn404WhenLoanDoesNotExist() throws Exception {
        when(getLoanByIdUseCase.execute(999)).thenThrow(new LoanNotFoundException(999));

        mockMvc.perform(get("/loans/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No existe un préstamo con id 999"));
    }

    @Test
    void shouldReturn400WhenIdIsNotANumber() throws Exception {
        mockMvc.perform(get("/loans/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El id debe ser un número"));
    }

    @Test
    void shouldCreateLoan() throws Exception {
        when(createLoanUseCase.execute("Rayuela", "Ana", "2026-11-15")).thenReturn(loan);

        mockMvc.perform(post("/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bookTitle\":\"Rayuela\",\"memberName\":\"Ana\",\"dueDate\":\"2026-11-15\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void shouldReturn400WhenUseCaseRejectsData() throws Exception {
        when(createLoanUseCase.execute(null, "Ana", "2026-11-15"))
                .thenThrow(new InvalidLoanException("El título del libro es obligatorio"));

        mockMvc.perform(post("/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"memberName\":\"Ana\",\"dueDate\":\"2026-11-15\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El título del libro es obligatorio"));
    }

    @Test
    void shouldReturn400WhenBodyIsNotValidJson() throws Exception {
        mockMvc.perform(post("/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{no es json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El cuerpo de la petición no es un JSON válido"));
    }
}

package uceva.members.infrastructure.controller;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import uceva.members.application.usecase.CreateMemberUseCase;
import uceva.members.application.usecase.GetMemberByIdUseCase;
import uceva.members.application.usecase.ListMembersUseCase;
import uceva.members.domain.entity.Member;
import uceva.members.domain.exception.InvalidMemberException;
import uceva.members.domain.exception.MemberNotFoundException;

class MemberControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private ListMembersUseCase listMembersUseCase;
    private GetMemberByIdUseCase getMemberByIdUseCase;
    private CreateMemberUseCase createMemberUseCase;

    @BeforeEach
    void setUp() {
        listMembersUseCase = mock(ListMembersUseCase.class);
        getMemberByIdUseCase = mock(GetMemberByIdUseCase.class);
        createMemberUseCase = mock(CreateMemberUseCase.class);

        MemberController controller = new MemberController(listMembersUseCase, getMemberByIdUseCase, createMemberUseCase);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldListMembers() throws Exception {
        Member member = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(listMembersUseCase.execute()).thenReturn(List.of(member));

        mockMvc.perform(get("/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].fullName").value("Juan Perez"))
                .andExpect(jsonPath("$[0].email").value("juan@email.com"))
                .andExpect(jsonPath("$[0].phone").value("3001112233"))
                .andExpect(jsonPath("$[0].active").value(true));
    }

    @Test
    void shouldGetMemberById() throws Exception {
        Member member = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(getMemberByIdUseCase.execute(1L)).thenReturn(member);

        mockMvc.perform(get("/members/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fullName").value("Juan Perez"));
    }

    @Test
    void shouldReturn404WhenMemberNotFound() throws Exception {
        when(getMemberByIdUseCase.execute(999L))
                .thenThrow(new MemberNotFoundException("Socio no encontrado con id: 999"));

        mockMvc.perform(get("/members/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Socio no encontrado con id: 999"));
    }

    @Test
    void shouldCreateMember() throws Exception {
        Member created = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(createMemberUseCase.execute("Juan Perez", "juan@email.com", "3001112233")).thenReturn(created);

        mockMvc.perform(post("/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateMemberRequest("Juan Perez", "juan@email.com", "3001112233"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fullName").value("Juan Perez"));
    }

    @Test
    void shouldReturn400WhenFullNameIsBlank() throws Exception {
        when(createMemberUseCase.execute("", "juan@email.com", "3001112233"))
                .thenThrow(new InvalidMemberException("El nombre completo es obligatorio"));

        mockMvc.perform(post("/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateMemberRequest("", "juan@email.com", "3001112233"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El nombre completo es obligatorio"));
    }
}

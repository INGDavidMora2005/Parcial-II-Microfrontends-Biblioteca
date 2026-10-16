import { Loan, LoanStatus, NewLoan } from '../../domain/entities/loan.entity';
import { CreateLoanDto, LoanDto } from '../dtos/loan.dto';

/**
 * Traduce entre los DTO de la API y las entidades del dominio.
 */
export class LoanMapper {
  /**
   * Convierte un préstamo de la API en una entidad del dominio.
   *
   * @param dto Préstamo tal como llega del microservicio.
   * @returns Entidad `Loan`.
   */
  static toEntity(dto: LoanDto): Loan {
    return {
      id: dto.id,
      bookTitle: dto.bookTitle,
      memberName: dto.memberName,
      loanDate: dto.loanDate,
      dueDate: dto.dueDate,
      status: dto.status as LoanStatus,
    };
  }

  /**
   * Convierte los datos de un préstamo nuevo en el cuerpo del POST.
   *
   * @param newLoan Datos del préstamo a registrar.
   * @returns DTO que se envía al microservicio.
   */
  static toCreateDto(newLoan: NewLoan): CreateLoanDto {
    return {
      bookTitle: newLoan.bookTitle,
      memberName: newLoan.memberName,
      dueDate: newLoan.dueDate,
    };
  }
}

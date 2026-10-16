import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Loan, NewLoan } from '../../domain/entities/loan.entity';
import { LoanRepository } from '../../domain/repositories/loan.repository';
import { API_CONFIG } from '../config/api.config';
import { LoanDto } from '../dtos/loan.dto';
import { LoanMapper } from '../mappers/loan.mapper';

/**
 * Adaptador que implementa `LoanRepository` llamando al microservicio por HTTP.
 *
 * @remarks
 * Es el único lugar del microfrontend que usa `HttpClient`. Recibe DTO de la API
 * y los convierte en entidades con `LoanMapper`.
 *
 * @example
 * ```ts
 * providers: [{ provide: LoanRepository, useClass: LoanApiGateway }]
 * ```
 */
@Injectable()
export class LoanApiGateway extends LoanRepository {
  /** Cliente HTTP de Angular (lo aporta el host o el `app.config.ts` en standalone) */
  private readonly httpClient = inject(HttpClient);

  /** URL completa del recurso de préstamos */
  private readonly url = `${API_CONFIG.baseUrl}${API_CONFIG.loansPath}`;

  /**
   * Obtiene todos los préstamos con `GET /api/loans`.
   *
   * @returns Observable que emite la lista de préstamos.
   */
  list(): Observable<Loan[]> {
    return this.httpClient
      .get<LoanDto[]>(this.url)
      .pipe(map((dtos) => dtos.map((dto) => LoanMapper.toEntity(dto))));
  }

  /**
   * Obtiene un préstamo con `GET /api/loans/:id`.
   *
   * @param id Identificador del préstamo.
   * @returns Observable que emite el préstamo encontrado.
   */
  getById(id: number): Observable<Loan> {
    return this.httpClient
      .get<LoanDto>(`${this.url}/${id}`)
      .pipe(map((dto) => LoanMapper.toEntity(dto)));
  }

  /**
   * Registra un préstamo con `POST /api/loans`.
   *
   * @param newLoan Datos del préstamo a registrar.
   * @returns Observable que emite el préstamo creado.
   */
  create(newLoan: NewLoan): Observable<Loan> {
    return this.httpClient
      .post<LoanDto>(this.url, LoanMapper.toCreateDto(newLoan))
      .pipe(map((dto) => LoanMapper.toEntity(dto)));
  }
}

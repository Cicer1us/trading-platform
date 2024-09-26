import { Injectable } from '@nestjs/common'
import { CreateLeverageTransferDto } from './dto/create-leverage-transfer.dto'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { LeverageTransfer } from './entities/leverage-transfer.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { LeverageTransferSearchParams } from './dto/leverage-transfer-search-params'
import { LeverageTransferResponseDto } from './dto/leverage-transfer-response.dto'

@Injectable()
export class LeverageTransferService {
	constructor(
		@InjectRepository(LeverageTransfer)
		private readonly leverageTransferRepository: Repository<LeverageTransfer>
	) {}

	create(createLeverageTransferDto: CreateLeverageTransferDto): Promise<LeverageTransfer> {
		return this.leverageTransferRepository.save(createLeverageTransferDto)
	}

	async getStatistic(params: LeverageTransferSearchParams): Promise<LeverageTransferResponseDto> {
		const query = this.applyDefaultLeverageTransferParams(params)
		query.select('sum(amount) as totalAmount')
		query.addSelect('count(*) as totalCount')
		const results = await query.getRawMany()
		return results[0]
	}

	applyDefaultLeverageTransferParams(
		params: LeverageTransferSearchParams
	): SelectQueryBuilder<LeverageTransfer> {
		const query = this.leverageTransferRepository
			.createQueryBuilder('lt')
			.where('lt.operation = :operation', { operation: params.operation })

		if (params.dateFrom) {
			query.andWhere('lt.createdAt >= :dateFrom', { dateFrom: params.dateFrom })
		}
		if (params.dateTo) {
			query.andWhere('lt.createdAt <= :dateTo', { dateTo: params.dateTo })
		}

		return query
	}
}

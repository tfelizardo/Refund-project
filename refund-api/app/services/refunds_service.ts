import Receipt from '#models/receipt'
import Refund from '#models/refund'
import {
  CreateRefundValidator,
  ListRefundValidator,
  ShowRefundValidator,
  SoftDeleteRefundValidator,
} from '#validators/refund_validator'
import { DateTime } from 'luxon'

export class RefundService {
  async all(payload: ListRefundValidator) {
    const limit = 10
    const page = payload.page ?? 1
    const searchTerm = payload.q

    const refunds = await Refund.query()
      .whereNull('deleted_at')
      .if(searchTerm, (query) => query.whereLike('title', `%${searchTerm}%`))
      .preload('receipt')
      .paginate(page, limit)

    return { refunds }
  }

  async create(payload: CreateRefundValidator) {
    const refund = await Refund.create({
      ...payload,
      value: payload.value * 100,
    })

    const receipt = await Receipt.findOrFail(payload.receipt)

    await refund.related('receipt').save(receipt)
    await refund.load('receipt')

    return { refund }
  }

  async findById(payload: ShowRefundValidator) {
    const refund = await Refund.query()
      .where('id', payload.params.id)
      .whereNull('deleted_at')
      .preload('receipt')
      .firstOrFail()

    return { refund }
  }

  async softDelete(payload: SoftDeleteRefundValidator) {
    const refund = await Refund.query()
      .where('id', payload.params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    refund.deletedAt = DateTime.local()

    await refund.save()

    return { message: `refund ${refund.title} deleted succesfully.` }
  }
}

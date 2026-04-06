import { ReceiptService } from '#services/receipts_service'
import { handleReceiptDownloadsValidator } from '#validators/receipt_downloads_validator'

import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ReceiptDownloadsController {
  async handle({ request, response }: HttpContext) {
    const receiptService = new ReceiptService()

    const payload = await request.validateUsing(handleReceiptDownloadsValidator)

    const result = await receiptService.findById(payload)

    const filePath = app.makePath('storage', result.receipt.path)

    return response.download(filePath)
  }
}
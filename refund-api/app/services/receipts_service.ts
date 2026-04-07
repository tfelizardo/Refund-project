import Receipt from '#models/receipt'
import {
  CreateReceiptValidator,
  DeleteReceiptValidator,
  ShowReceiptValidator,
} from '#validators/receipt_validator'
import drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'

export class ReceiptService {
  async create(payload: CreateReceiptValidator) {
    const receipt = new Receipt()

    const fileName = `${new Date().getTime()}-${payload.receiptFile.clientName.replace(/\s+/g, '_')}`

    // Actually move the file to the 'storage/uploads' folder
    await payload.receiptFile.move(app.makePath('storage/uploads'), {
      name: fileName
    })

    receipt.originalFilename = payload.receiptFile.clientName.split(
      `.${payload.receiptFile.extname}`
    )[0]
    receipt.path = `storage/uploads/${fileName}`
    receipt.extname = payload.receiptFile.extname!
    receipt.filename = fileName

    await receipt.save()

    return { receipt }
  }

  async findById(payload: ShowReceiptValidator) {
    const receipt = await Receipt.findOrFail(payload.params.id)

    return { receipt }
  }

  async delete(payload: DeleteReceiptValidator) {
    const receipt = await Receipt.findOrFail(payload.params.id)
    const disk = drive.use()

    await Promise.all([disk.delete(receipt.path), receipt.delete()])

    return { message: `receipt ${receipt.filename} deleted succesfully.` }
  }
}

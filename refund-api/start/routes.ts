/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ReceiptDownloadsController = () => import('#controllers/receipt_downloads_controller')
const ReceiptsController = () => import('#controllers/receipts_controller')
const RefundsController = () => import('#controllers/refunds_controller')

import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { status: 'Refund API is running perfectly! 🚀' }
})

router.resource('refunds', RefundsController).only(['index', 'store', 'show', 'destroy'])
router.resource('receipts', ReceiptsController).only(['store', 'show', 'destroy'])
router.get('receipts/download/:id', [ReceiptDownloadsController])

router.get('/receipts/file/:filename', async ({ params, response }) => {
  const filePath = `storage/uploads/${params.filename}`
  return response.download(filePath)
})


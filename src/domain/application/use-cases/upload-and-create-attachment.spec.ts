import { FakeUploader } from 'test/storage/fake-uploader.impl'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment.use-case'
import { InMemoryAttachmentsRepositoryImpl } from 'test/repositories/in-mamory-attachments-repository.impl'

describe('Upload and create attachment', () => {
  let inMemoryAttachmentsRepositoryImpl: InMemoryAttachmentsRepositoryImpl
  let fakeUploader: FakeUploader

  let sut: UploadAndCreateAttachmentUseCase

  beforeEach(() => {
    inMemoryAttachmentsRepositoryImpl = new InMemoryAttachmentsRepositoryImpl()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepositoryImpl,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepositoryImpl.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
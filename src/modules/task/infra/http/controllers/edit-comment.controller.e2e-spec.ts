import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment.factory';
import { CommentAttachmentFactory } from 'test/factories/make-comment-attachment.factory';
import { CommentFactory } from 'test/factories/make-comment.factory';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Edit Comment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let taskFactory: TaskFactory
  let attachmentFactory: AttachmentFactory
  let commentFactory: CommentFactory
  let commentAttachmentFactory: CommentAttachmentFactory


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TaskFactory, AttachmentFactory, CommentFactory, CommentAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    taskFactory = moduleRef.get(TaskFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    commentFactory = moduleRef.get(CommentFactory)
    commentAttachmentFactory = moduleRef.get(CommentAttachmentFactory)

    await app.init();
  });

  test('[PUT] /comments/:id', async () => {
    const task = await taskFactory.makePrismaTask()

    const comment = await commentFactory.makePrismaComment({
      taskId: task.id
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await commentAttachmentFactory.makePrismaCommentAttachment({
      attachmentId: attachment1.id,
      commentId: comment.id
    })

    await commentAttachmentFactory.makePrismaCommentAttachment({
      attachmentId: attachment2.id,
      commentId: comment.id
    })

    const commentId = comment.id.toString()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/comments/${commentId}`)
      .send({
        content: 'Edit Content',
        attachmentsIds: [
          attachment1.id.toString(),
          attachment3.id.toString()
        ]
      });

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'Edit Content',
        id: commentId
      },
    });

    expect(commentOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        commentId: commentOnDatabase.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString()
        }),
        expect.objectContaining({
          id: attachment3.id.toString()
        })
      ])
    )
  });

  test('[PUT] /comments/:id not exists', async () => {
    await taskFactory.makePrismaTask()

    const response = await request(app.getHttpServer())
      .put(`/comments/commentid-qualquer`)
      .send({
        content: 'Edit content',
        attachmentsIds: [],
      });

    expect(response.statusCode).toBe(404);
  });
});

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Attachment, AttachmentProps } from 'src/domain/enterprise/attachment.entity';
import { PrismaAttachmentMapper } from 'src/infra/database/prisma/mappers/prisma-attachment-mapper';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.instance(
    {
      title: faker.lorem.sentence(3),
      path: faker.lorem.slug(),
      ...override,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment)
    })

    return attachment
  }
}
import { Context, Schema, h } from 'koishi'

export const name = 'imageprovider'

interface ImageProviderEntry {
  message: string
  imageUrl: string
}

export interface Config {
  entries: ImageProviderEntry[]
}

export const Config: Schema<Config> = Schema.object({
  entries: Schema.array(Schema.object({
    message: Schema.string().required().description('触发消息内容'),
    imageUrl: Schema.string().required().description('回复图片URL'),
  })).description('消息与回复图片配置'),
})

export function apply(ctx: Context, config: Config) {
  ctx.on('message', (session) => {
    for (const entry of config.entries) {
      if (session.content === entry.message) {
        session.send(h('img', { src: entry.imageUrl }))
        return
      }
    }
  })
}

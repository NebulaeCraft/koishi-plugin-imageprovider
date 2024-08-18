import { Context, Schema, h } from 'koishi'

export const name = 'imageprovider'

interface ImageProviderEntry {
  message: string
  imageUrl: string
  availableGuilds: string[]
}

export interface Config {
  entries: ImageProviderEntry[]
}

export const Config: Schema<Config> = Schema.object({
  entries: Schema.array(Schema.object({
    message: Schema.string().required().description('触发消息内容'),
    imageUrl: Schema.string().required().description('回复图片URL'),
    availableGuilds: Schema.array(Schema.string()).default([]).description('生效群组列表'),
  })).description('消息、回复图片、可用群组配置')
})

export function apply(ctx: Context, config: Config) {
  ctx.on('message', (session) => {
    for (const entry of config.entries) {
      if (session.content === entry.message) {
        if (entry.availableGuilds.length && !entry.availableGuilds.includes(session.guildId)) return
        session.send(h('img', { src: entry.imageUrl }))
        return
      }
    }
  })
}

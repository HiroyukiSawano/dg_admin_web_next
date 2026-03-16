export class MockSSEResponse {
  constructor(data, delay = 100, error = false) {
    this.encoder = new TextEncoder()
    this.error = error
    this.currentPhase = 'reason'

    this.stream = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
        if (!this.error) {
          // 如果不是错误情况，则开始推送数据
          setTimeout(() => this.pushData(), delay) // 延迟开始推送数据
        }
      },
      cancel() {}
    })

    this.data = data
    this.delay = delay
  }

  async pushData() {
    try {
      if (this.currentPhase === 'reason') {
        // 推送推理内容
        if (this.data.reason.length > 0) {
          const chunk = JSON.stringify({
            delta: {
              reason: this.data.reason.slice(0, 1),
              content: '',
            },
            status: 0,
            finished: false, // 回答开始
          })
          this.controller.enqueue(this.encoder.encode(chunk))
          this.data.reason = this.data.reason.slice(1)
          // 设置下次推送
          setTimeout(() => this.pushData(), this.delay)
        } else {
          // 推理内容推送完成，切换到正式内容
          this.currentPhase = 'content'
          setTimeout(() => this.pushData(), this.delay) // 立即开始推送正式内容
          return;
        }
      }

      if (this.currentPhase === 'content') {
        // 推送正式内容
        if (this.data.content.length > 0) {
          const chunk = JSON.stringify({
            delta: {
              reason: '',
              content: this.data.content.slice(0, 1),
            },
            status: this.data.content.length === 1 ? 2 : 1, // 思考结束状态为1
            finished: this.data.content.length === 1, // 最后一个字符时回答结束
          })
          this.controller.enqueue(this.encoder.encode(chunk))
          this.data.content = this.data.content.slice(1)

          // 设置下次推送
          setTimeout(() => this.pushData(), this.delay)
        } else {
          // 全部内容推送完成
          setTimeout(() => this.controller.close(), this.delay)

        }
      }
    } catch {}
  }

  async getResponse() {
    return new Promise((resolve) => {
      // 使用setTimeout来模拟网络延迟
      setTimeout(() => {
        if (this.error) {
          const errorResponseOptions = { status: 500, statusText: 'Internal Server Error' }

          // 返回模拟的网络错误响应，这里我们使用500状态码作为示例
          resolve(new Response(null, errorResponseOptions))
        } else {
          // resolve(new Response(this.stream))
          resolve({
            response: new Response(this.stream),
            payload: this.data
          })
        }
      }, this.delay) // 使用构造函数中设置的delay值作为延迟时间
    })
  }
}

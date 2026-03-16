import { fetchEventSource } from '@microsoft/fetch-event-source'
import { isClient, toRef, tryOnScopeDispose } from '@vueuse/shared'
import { shallowRef, watch, toValue } from 'vue'

const resolveNestedOptions = (options) => {
  if (options === true) return {}
  if (options === false) return null
  return options
}

const resolveRequestBody = (body) => {
  const raw = toValue(body)
  if (raw == null) return undefined
  return typeof raw === 'string' ? raw : JSON.stringify(raw)
}

export const useFetchEventSourceHook = (url, events = [], options = {}) => {
  const event = shallowRef(null)
  const data = shallowRef(null)
  const status = shallowRef('CLOSED')
  const error = shallowRef(null)
  const lastEventId = shallowRef(null)
  const controller = shallowRef(null)

  const urlRef = toRef(url)

  let explicitlyClosed = false
  let retried = 0

  const {
    immediate = false,
    autoConnect = false,
    autoReconnect = false,
    serializer = { read: (v) => v },
    method = 'GET',
    headers = {},
    body = undefined,
    onOpen,
    onMessage,
    onError,
    onClose,
  } = options

  const close = () => {
    if (controller.value) {
      controller.value.abort()
      controller.value = null
    }
    status.value = 'CLOSED'
    explicitlyClosed = true
  }

  const _init = async () => {
    if (!isClient || explicitlyClosed || urlRef.value == null) return

    status.value = 'CONNECTING'
    error.value = null
    controller.value = new AbortController()

    const normalizedMethod = method.toUpperCase()
    const requestBody = !['GET', 'HEAD'].includes(normalizedMethod) ? resolveRequestBody(body) : undefined

    const fetchOptions = {
      method: normalizedMethod,
      headers: {
        ...(requestBody != null && !headers['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: requestBody,
      signal: controller.value.signal,
    }

    try {
      await fetchEventSource(urlRef.value, {
        ...fetchOptions,
        onopen: async (res) => {
          if (res.ok) {
            status.value = 'OPEN'
            error.value = null
            onOpen?.(res)
          } else {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
          }
        },
        // onmessage: (res) => {
        //   if (res.data) {
        //     console.log('eventType', res)
        //     const eventType = res.event || 'message'

        //     if (events.length === 0 || events.includes(eventType)) {
        //       event.value = eventType
        //       const parsed = serializer.read(res.data)
        //       data.value = parsed
        //       lastEventId.value = res.id || null
        //       onMessage?.(parsed)
        //     }
        //   }
        // },
        onmessage: (res) => {
          let payload = res.data
          let evt = ''
          let id = ''

          if (typeof payload === 'string') {
            try {
              const parsed = (serializer?.read ?? JSON.parse)(payload)
              if (parsed && typeof parsed === 'object') {
                payload = parsed
                evt = parsed.event ?? ''
                id = parsed.id ?? ''
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', payload, e)
            }
          }

          if (events.length === 0 || events.includes(evt || res.event || 'message')) {
            data.value = payload
            event.value = evt || res.event || 'message'
            lastEventId.value = id || res.id || ''
            onMessage?.(payload)
          }
        },
        onerror: (err) => {
          error.value = err
          onError?.(err)
          throw err
        },
        onclose: () => {
          status.value = 'CLOSED'
          onClose?.()

          if (!explicitlyClosed && autoReconnect) {
            const reconnectOpts = resolveNestedOptions(autoReconnect)
            if (reconnectOpts) {
              const { retries = -1, delay = 1000, onFailed } = reconnectOpts
              retried += 1

              const shouldRetry = typeof retries === 'number' ? retries < 0 || retried < retries : typeof retries === 'function' && retries(retried, error.value)

              if (shouldRetry) {
                setTimeout(_init, delay)
              } else {
                onFailed?.()
              }
            }
          }
        },
      })
    } catch (err) {
      error.value = err
      status.value = 'CLOSED'
    }
  }

  const open = () => {
    if (!isClient) return
    close()
    explicitlyClosed = false
    retried = 0
    _init()
  }

  if (autoConnect) {
    watch(urlRef, open)
  }

  if (immediate) {
    open()
  }

  tryOnScopeDispose(close)

  return {
    event,
    data,
    status,
    error,
    lastEventId,
    controller,
    open,
    close,
  }
}

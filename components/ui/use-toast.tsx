import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastType = "default" | "destructive" | "success"

type ToastState = {
  id: string
  title: string
  description?: string
  type?: ToastType
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToastState
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToastState> & Pick<ToastState, "id">
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToastState["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToastState["id"]
    }

interface State {
  toasts: ToastState[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToast = (state: State, toast: ToastState) => {
  const { toasts } = state
  const nextToasts = [...toasts, toast]

  if (nextToasts.length > TOAST_LIMIT) {
    nextToasts.shift()
  }

  return { ...state, toasts: nextToasts }
}

const updateToast = (state: State, toast: Partial<ToastState> & Pick<ToastState, "id">) => {
  const { toasts } = state
  const nextToasts = toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t))

  return { ...state, toasts: nextToasts }
}

const dismissToast = (state: State, toastId?: ToastState["id"]) => {
  const { toasts } = state
  const nextToasts = toasts.map((t) =>
    t.id === toastId || toastId === undefined
      ? {
          ...t,
          open: false,
        }
      : t
  )

  return { ...state, toasts: nextToasts }
}

const removeToast = (state: State, toastId?: ToastState["id"]) => {
  const { toasts } = state
  const nextToasts = toasts.filter((t) => t.id !== toastId)

  return { ...state, toasts: nextToasts }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return addToast(state, action.toast)
    case actionTypes.UPDATE_TOAST:
      return updateToast(state, action.toast)
    case actionTypes.DISMISS_TOAST:
      return dismissToast(state, action.toastId)
    case actionTypes.REMOVE_TOAST:
      return removeToast(state, action.toastId)
    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToastState, "id">

function toast({ ...props }: Toast) {
  const id = Math.random().toString(36).substr(2, 9)
  const update = (props: ToastState) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
export type { ToastProps }
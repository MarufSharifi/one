import { merge } from 'ts-deepmerge'
import type { User, UserState } from '~/zero/schema'
import { mutate, useQuery } from '~/zero/zero'

// TODO
export let currentUser = null as User | null

const getJustUserState = () => {
  return {
    activeChannels: {},
    ...(currentUser?.state ?? {}),
  }
}

export const getDerivedUserState = () => {
  const state = getJustUserState()
  const activeChannel = state.activeChannels[state.activeServer || '']
  return {
    activeChannel,
    activeChannelState: state.channelState?.[activeChannel],
    activeThread: state.channelState?.[activeChannel],
    user: currentUser,
  }
}

export const getUserState = () => {
  const state = getJustUserState()
  return [state, getDerivedUserState()] as const
}

export const useUserState = () => {
  const user = useQuery((q) => q.user)[0][0]
  currentUser = user
  return getUserState()
}

export const updateUserState = async (next: Partial<UserState>) => {
  if (!currentUser) {
    console.error(`No user`)
    return
  }

  const nextUser = {
    ...currentUser,
    state: merge(getJustUserState(), next) as UserState,
  }

  console.warn('mutating', nextUser)

  await mutate.user.update(nextUser)
}

// helpers

export const useUserCurrentChannelState = () => {
  const [_, { activeChannelState }] = useUserState()
  return activeChannelState || {}
}

export const useCurrentThread = () => {
  const [_, { activeThread }] = useUserState()
  const [thread] = useQuery((q) =>
    q.thread
      .where('id', activeThread?.openedThreadId || '')
      .related('messages', (q) =>
        q.orderBy('createdAt', 'asc').related('reactions').related('sender')
      )
  )
  return thread[0]
}

export const updateUserCurrentChannel = async (next: Partial<ChannelState>) => {
  if (!currentUser) {
    console.error(`No user`)
    return
  }

  const currentChannelId = getDerivedUserState().activeChannel

  return await updateUserState({
    channelState: {
      [currentChannelId]: next,
    },
  })
}

export const updateUserOpenThread = async (thread: { id: string }) => {
  updateUserCurrentChannel({
    openedThreadId: thread.id,
  })
}

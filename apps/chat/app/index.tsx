import { XStack, YStack } from 'tamagui'
import { AnimationDriver } from '~/interface/animations/AnimationDriver'
import { Main } from '~/interface/main/Main'
import { MainMessageInput } from '~/interface/main/MainMessageInput'
import { AccountSettingsPane } from '~/interface/settings/AccountSettingsPane'
import { ServerSettingsPane } from '~/interface/settings/ServerSettingsPane'
import { Sidebar } from '~/interface/sidebar/Sidebar'
import { TopBar } from '~/interface/TopBar'
import { useUserState } from '~/state/user'

export default function HomePage() {
  return (
    <AppFrame>
      <TopBar />

      <XStack position="relative" items="stretch" flex={1} overflow="hidden">
        <Sidebar />
        <Main />
      </XStack>

      <MainMessageInput />

      <ServerSettingsPane />
      <AccountSettingsPane />
    </AppFrame>
  )
}

const AppFrame = ({ children }: { children: any }) => {
  const [userState] = useUserState()

  return (
    <AnimationDriver name="css">
      <YStack flex={1} overflow="hidden" animation="quicker">
        <AnimationDriver name="spring">{children}</AnimationDriver>
      </YStack>
    </AnimationDriver>
  )
}

// <a target="_blank" href={window.location.origin + '/login-github'} rel="noreferrer">
// <Button size="$2">Github</Button>
// </a>

// {user?.image && <img src={user.image} style={{ width: 32, height: 32 }} />}

// {user && (
// <Button
//   onPress={() => {
//     authClient.signOut()
//   }}
// >
//   Sign out
// </Button>
// )}

// <ScrollView>
//         <YStack p="$4" pt="$10">
//           <CollapsedChats>
//             <Chat
//               {...{
//                 name: 'test',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: <Circle size={32} bg="red" mt={4}></Circle>,
//               }}
//             />

//             <Chat
//               {...{
//                 name: 'natew',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: (
//                   <Circle size={32} bg="$color9" mt={4}>
//                     <OneBall size={1.3} />
//                   </Circle>
//                 ),
//               }}
//             />
//           </CollapsedChats>

//           <ThreadRow title="Android bug" description="JDK version 9.0 bug building app container" />

//           <DateSeparator />

//           <CollapsedChats>
//             <Chat
//               {...{
//                 name: 'test',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: <Circle size={32} bg="red" mt={4}></Circle>,
//               }}
//             />

//             <Chat
//               {...{
//                 name: 'natew',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: (
//                   <Circle size={32} bg="$color9" mt={4}>
//                     <OneBall size={1.3} />
//                   </Circle>
//                 ),
//               }}
//             />
//           </CollapsedChats>

//           <ThreadRow
//             title="Supertokens Support"
//             description="Requesting official support for supertokens."
//           />

//           <CollapsedChats>
//             <Chat
//               {...{
//                 name: 'test',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa. Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: <Circle size={32} bg="red" mt={4}></Circle>,
//               }}
//             />

//             <Chat
//               {...{
//                 name: 'natew',
//                 contents:
//                   'Irure sunt eu do quis voluptate do nulla deserunt proident laborum culpa.',
//                 avatar: (
//                   <Circle size={32} bg="$color9" mt={4}>
//                     <OneBall size={1.3} />
//                   </Circle>
//                 ),
//               }}
//             />
//           </CollapsedChats>

//           <DateSeparator />

//           <ThreadRow title="Some Thread" />

//           <ThreadRow title="Some Thread" />

//           {/* {chats.map((chat, i) => {
//             return <Chat key={i} {...chat} />
//           })} */}
//         </YStack>
//       </ScrollView>

// const DateSeparator = () => {
//   return (
//     <XStack gap="$6" items="center" justify="center">
//       <Separator borderColor="rgba(0,0,0,0.1)" />
//       <SizableText>Dec 2nd, 2024</SizableText>
//       <Separator borderColor="rgba(0,0,0,0.1)" />
//     </XStack>
//   )
// }

// const ThreadRow = (props: { title: string; description?: string }) => {
//   return (
//     <ThreadButtonFrame size="large">
//       <YStack>
//         <XStack items="center" justify="center" gap="$2">
//           <Circle size={32} bg="$color9">
//             <OneBall size={1} />
//           </Circle>

//           <SizableText size="$5" select="none" cursor="default" flex={1} overflow="hidden">
//             {props.title}
//           </SizableText>
//         </XStack>

//         {!!props.description && <SizableText opacity={0.7}>{props.description}</SizableText>}
//       </YStack>
//     </ThreadButtonFrame>
//   )
// }

// const CollapsedChats = (props) => {
//   const [collapsed, setCollapsed] = useState(true)

//   if (collapsed) {
//     return (
//       <YStack
//         p="$3"
//         rounded="$4"
//         gap="$2"
//         hoverStyle={{
//           bg: '$color3',
//         }}
//         onPress={() => {
//           setCollapsed(!collapsed)
//         }}
//       >
//         <XStack items="center" gap="$6">
//           {/* <Separator borderColor="rgba(0,0,0,0.1)" /> */}
//           <SizableText style={{ fontWeight: '500' }} size="$4">
//             25 messages
//           </SizableText>
//           {/* <Separator borderColor="rgba(0,0,0,0.1)" /> */}
//         </XStack>

//         <XStack>
//           <XStack items="center" gap="$2">
//             <Circle size={16} bg="$color9" mt={4}>
//               <OneBall size={0.7} />
//             </Circle>
//             <SizableText size="$3">natew</SizableText>
//           </XStack>

//           <SizableText size="$3">
//             {' '}
//             and 3 others talked about supertokens, auth, and the next release.
//           </SizableText>
//         </XStack>
//       </YStack>
//     )
//   }

//   return (
//     <YStack
//       onPress={() => {
//         setCollapsed(!collapsed)
//       }}
//     >
//       {props.children}
//     </YStack>
//   )
// }

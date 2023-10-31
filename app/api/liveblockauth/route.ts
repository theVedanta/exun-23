import { authorize } from '@liveblocks/node'

const secret = 'sk_dev_STAsTz7O7pe8Er5IPSAqXpEOd1USwD9fJf39k10C03QG3N1vP99Wu4TzFMwvSBpL'
// const secret = process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY as string;

export async function POST(req: Request, res: Response) {
  const data = await req.json()
  const room = data.room
  const {body, status} = await authorize({room, secret, userId:'123'})
  return new Response(body, {
    status
  })

}
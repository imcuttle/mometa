import { Detail } from '../../component/detail'

export default function DetailPage({ match }: any) {
  return <Detail id={match.params.id} />
}

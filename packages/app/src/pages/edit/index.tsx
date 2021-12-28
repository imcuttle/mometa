import { Detail } from '../../component/detail'

export default function EditPage({ match }: any) {
  return <Detail id={match.params.id} editable />
}

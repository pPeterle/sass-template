import { graphql, useFragment } from "react-relay";
import type { Film_item$key } from "./__generated__/Film_item.graphql";

export default function FilmListItem(props: { film: Film_item$key; }) {
  const film = useFragment<Film_item$key>(
    graphql`
      fragment Film_item on Film {
        title
        director
        edited
      }
    `,
    props.film
  );

  return (
    <li>
      <b>{film.title}</b>: directed by <i>{film.director}</i>
    </li>
  );
}
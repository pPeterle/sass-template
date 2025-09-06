/**
 * @generated SignedSource<<907aac918c74cce713a393c3c624b75f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Film_item$data = {
  readonly director: string | null | undefined;
  readonly edited: string | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "Film_item";
};
export type Film_item$key = {
  readonly " $data"?: Film_item$data;
  readonly " $fragmentSpreads": FragmentRefs<"Film_item">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Film_item",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "director",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "edited",
      "storageKey": null
    }
  ],
  "type": "Film",
  "abstractKey": null
};

(node as any).hash = "555c670bbd5043aa93dfb7efc23b378f";

export default node;

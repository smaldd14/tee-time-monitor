import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry } from "@json-render/react";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";
import { shadcnComponents } from "@json-render/shadcn";

export const teeTimeCatalog = defineCatalog(schema, {
  components: {
    Card: shadcnComponentDefinitions.Card,
    Stack: shadcnComponentDefinitions.Stack,
    Grid: shadcnComponentDefinitions.Grid,
    Heading: shadcnComponentDefinitions.Heading,
    Text: shadcnComponentDefinitions.Text,
    Table: shadcnComponentDefinitions.Table,
    Badge: shadcnComponentDefinitions.Badge,
    Alert: shadcnComponentDefinitions.Alert,
    Separator: shadcnComponentDefinitions.Separator,
  },
  actions: {},
});

export const { registry: teeTimeRegistry } = defineRegistry(teeTimeCatalog, {
  components: {
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,
    Table: shadcnComponents.Table,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Separator: shadcnComponents.Separator,
  },
});

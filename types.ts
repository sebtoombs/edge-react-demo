export type PageComponent = (props: any) => JSX.Element;

export interface Page {
  default: PageComponent;
  getEdgeProps?: (ctx: EdgeCtx) => Promise<any> | any;
}

export interface EdgeCtx {
  path: string;
  params: Record<string, any>;
}

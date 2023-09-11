function Hide({ children, condition }: any) {
  return condition ? '' : children;
}

export default Hide;

/** Static wrapper retained for the existing component API. */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {

  return (
    <Tag
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

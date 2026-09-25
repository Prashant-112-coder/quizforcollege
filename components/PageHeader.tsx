import Link from "next/link";
export default function PageHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:{href:string;label:string}}){
 return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<Link className="button secondary-button" href={action.href}>{action.label} →</Link>}</div>
}

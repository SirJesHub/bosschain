import {VariantProps, cva } from "class-variance-authority"

const buttonStyles = cva(["hover:bg-blue-300", "transition-colors"],{
  variants:{
    variant:{
        default:["hover:bg-neutral-950", "bg-neutral-300"],
        ghost:["hover:bg-grey-100"],
        secondary:["bg-neutral-300"]
    },
    size:{
        default:["rounded", "p-2"],
        
        icon:["rounded-full", "w-10", "flex", "item-center", "justify-center", "p-2.5"]
    }
  }  
})

type ButtonProps = VariantProps<typeof buttonStyles>

export default function Button({variant, size}: ButtonProps) {
  return (
    <button className={buttonStyles({variant,size})}></button>
  )
}

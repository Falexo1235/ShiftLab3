import LoginFunc from "@/components/ui/phone-verify"

export default function LoginButton () {
return(
    <div
    style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}
    >
    <LoginFunc></LoginFunc>
  </div>
)}
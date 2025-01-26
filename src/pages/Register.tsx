import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";


const Register = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleSave = () => {
    
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card>
        <CardTitle className="p-10">DevMate에 오신 것을 환영합니다!</CardTitle>
        <CardDescription className="p-8">Devmate 내에서 사용하실 이름을 설정해주세요.</CardDescription>
        <CardContent>
            <Input type="userName" value={inputValue} onChange={handleInputChange} placeholder="이름(또는 닉네임)을 입력해주세요"></Input>
            <Button className="mt-4 w-[400px]" onClick={handleSave} disabled={!inputValue.trim()}>계정 생성하기</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
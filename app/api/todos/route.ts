// 경로 /todos에서 수행될 api들
import { NextRequest } from "next/server";

import { addATodo, fetchTodos } from "@/data/firestore";

// 모든 할 일(리스트) 조회
export async function GET(request: NextRequest) {
  const fetchedTodos = await fetchTodos();
  const response = {
    data: fetchedTodos,
  };

  return Response.json(response, { status: 200 });
}

// 할 일 추가
export async function POST(request: NextRequest) {
  const { title } = await request.json();

  const addedATodo = await addATodo({ title });

  const response = {
    message: "할 일 추가 성공!",
    data: addedATodo,
  };

  return Response.json(response, { status: 201 });
}

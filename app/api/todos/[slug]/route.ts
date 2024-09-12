// 경로 /todos/[id]에서 수행될 api들
import { NextRequest } from "next/server";

import { deleteATodo, editATodo, fetchATodo } from "@/data/firestore";

// 단일 할 일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  // 쿼리스트링 방법
  // const searchParams = request.nextUrl.searchParams;
  // const query = searchParams.get("query");

  const fetchedTodo = await fetchATodo(params.slug);

  if (!fetchedTodo) {
    return new Response(null, { status: 204 });
  }

  const response = {
    data: fetchedTodo,
  };

  return Response.json(response, { status: 200 });
}

// 단일 할 일 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const deletedTodo = await deleteATodo(params.slug);

  if (!deletedTodo) return new Response(null, { status: 204 });

  const response = {
    message: "할 일 삭제 성공!",
    data: deletedTodo,
  };

  return Response.json(response, { status: 200 });
}

// 단일 할 일 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { title, is_done } = await request.json();

  const editedTodo = await editATodo(params.slug, {
    title,
    is_done,
  });

  if (!editedTodo) return new Response(null, { status: 204 });

  const response = {
    message: "할 일 수정 성공!",
    data: editedTodo,
  };

  return Response.json(response, { status: 200 });
}

/* eslint-disable prettier/prettier */

import { NextRequest } from "next/server";

// 메인 페이지 조회
export async function GET(request: NextRequest) {
  const response = {
    data: "넥스트 투두",
  };

  return Response.json(response, { status: 201 });
}

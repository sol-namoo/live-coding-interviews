import React from "react";

type Props = { };

export class ErrorLogger extends React.Component<Props> {
  componentDidUpdate() {
    // 의도적으로 모든 업데이트에서 로그를 찍는, '문제 상태'
    console.error("This error should not be printed");
  }

  render() {
    return null;
  }
}
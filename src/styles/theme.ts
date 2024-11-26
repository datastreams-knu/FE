import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Nanum Pen Script', cursive", // 제목에 사용할 폰트 설정
    body: "'GangwonEduSaeeum_OTFMediumA', cursive", // 본문에 사용할 폰트 설정
  },
});

export default theme;

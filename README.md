**실행환경**
![image](https://user-images.githubusercontent.com/59286004/129464356-e0e38ba0-915f-486b-a88d-3e437eda0094.png)


aws의 ec2환경에서 서버를 뒀다.
자바스크립트만을 이용해서 게시판을 만들었고 글쓰기, 비밀번호를 통한 삭제를 두었다.

**1.메인화면**
![image](https://user-images.githubusercontent.com/59286004/129464410-4c96adc3-ba9b-43f9-bd52-335c74d25515.png)
아직 불완전한 상태입니다.
원래는 페이지에 대한 표시가 존재해야 하는데 페이지가 뜨지를 않네요
![image](https://user-images.githubusercontent.com/59286004/129464424-0409a76c-7b03-4d31-8b0b-1068e3899ed4.png)
지금처럼 page=1이 떠줘야만 합니다.

![image](https://user-images.githubusercontent.com/59286004/129464430-a11be8d4-abad-409e-81f9-1cdf16f12379.png)
다음을 누르면
![image](https://user-images.githubusercontent.com/59286004/129464435-93f9df78-5333-4665-b539-cdcde246853b.png)
페이지가 넘어가는 것을 확인할 수 있습니다.

**2.글쓰기**
![image](https://user-images.githubusercontent.com/59286004/129464444-f091e947-ec04-42af-a3c0-e4807d2ce2f9.png)
뒤로가기를 누르면 기존의 글쓰기를 눌렀던 페이지로 다시 돌아가는 기능을 넣었습니다.
![image](https://user-images.githubusercontent.com/59286004/129464453-8593f498-a570-4805-8630-17576756e2d5.png)
![image](https://user-images.githubusercontent.com/59286004/129464457-e795539e-b74c-434b-8198-f6586a12bbca.png)
post 방식으로 글쓰기를 했기 때문에 get으로 보냈을 때의 비밀번호 문제를 방지할 수 있었습니다.

**3.본문**
![image](https://user-images.githubusercontent.com/59286004/129464489-0155c7a7-dd22-474c-8f9b-cb0faf728953.png)
글쓴이는 빨간색으로 나타냈고 
본문은 초록색으로 나타냈습니다.
![image](https://user-images.githubusercontent.com/59286004/129464501-10cf8a50-3841-41ac-bb89-af872ef3f7fb.png)
삭제하기를 누르면 비밀번호 입력창이 뜨고
![image](https://user-images.githubusercontent.com/59286004/129464523-742d3150-aa2d-40c5-be55-6cade00d5ed8.png)
비밀번호를 제대로 입력하면 삭제가 된 것을 확인할 수 있습니다.

**4. table_orgin.js와 table.js의 차이**
table_orgin은 아직 비동기적인 방식으로 작동하는 코드입니다. 콜백으로 계속 받다보니 코드도 보기 불편해서 
리팩토링을 하여 코드 전체를 최대한 동기적인 방식으로 코드를 수정했습니다.





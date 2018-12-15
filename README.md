# gdx-frieden

> フリーデンは、旧連邦軍が開発したアルプス級陸上戦艦をバルチャーが改装した艦である。バルチャーの仕事として、主に旧連邦軍や宇宙革命軍の残したモビルスーツ等の物資の収集や交易などに用いられていた。またガンダムシリーズの戦艦としては初の実弾武器だけ（メガ粒子砲などのビーム兵器が一切無い）の戦艦であった。  
> 艦長はジャミル・ニート。彼はバルチャーであり、特定の勢力には所属していない。  
> 当初の乗組員は、サラ・タイレル、トニヤ・マーム、キッド・サルサミル、テクス・ファーゼンバーグ、シンゴ・モリなどである。のちにジャミルのニュータイプ探しの旅に加わったガロード・ランとティファ・アディールが、また専属護衛契約を結んだモビルスーツ乗りのウィッツ・スーとロアビィ・ロイも加わった。  
> 搭載モビルスーツはガロードのガンダムX、ウィッツのガンダムエアマスター、ロアビィのガンダムレオパルド。後にガロードが入手したガンダムダブルエックスが加わった。他に交易物資としてドートレスなどその他のモビルスーツを積み込むこともしばしばあった。  
> 艦内工場にはキッドがかき集めたジャンクパーツが山積みされており、これを用いて損壊したX、エアマスター、レオパルドをそれぞれガンダムXディバイダー、ガンダムエアマスターバースト、ガンダムレオパルドデストロイに強化している。  
> フリーデンは新連邦軍が姿を現して以降、これらと幾度も激戦を繰り広げた。その後宇宙革命軍に拉致されたティファを救出するためにガロードが宇宙へシャトルで飛びだつ際、これを妨害する新連邦軍の移動要塞に体当たり攻撃を仕掛け大破した。  

## 設定
- S3bucket
  - gdx-frieden
- tfstate
  - /terraform/${STAGE}/terraform.tfstate
- AWS credentials
  - ~/.aws/credentials
  ```
  [gdx]
  aws_access_key_id = <your access key id>
  aws_secret_access_key = <your secret access key>
  ```

## How to use
```
git clone https://github.com/jbgrouposs-cloudnative/gdx-frieden.git
cd gdx-frieden/product
terraform fmt
terraform init
terraform plan
terraform apply
```

### ローカルでkubectlコマンドを試す場合
%HOME%\.kube\configにkubeconfig_gdx-cluster-prodをマージする

## CI/CD
- CircleCIで上記１～５までを実施  
- 手動で`terraform apply`を実施

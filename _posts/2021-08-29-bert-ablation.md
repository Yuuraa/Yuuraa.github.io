---
title: "[ BERT Study ]  BERT Ablation Study" 
date: 2021-08-29 23:20:30 -0400
categories: til BERT\ 스터디
---

# 유라 - Ablation Studies

- Contents

## Summary

> 1️⃣ **사전학습 태스크들의 영향**: NSP 제거 실험 & NSP 제거 + ~~MLM~~→LTR 실험
NSP 제거 시 QNLI, MNLI, SQuAD 1.1에서의 성능 저하가, 
두 가지 사전학습을 모두 제거하고 LTR로 학습할 시 모든 태스크 특히, MRPC와 SQuAD에서 큰 성능 저하가 발생함을 확인해 사전학습 태스크들이 BERT의 성능에 핵심적임을 보였다

> 2️⃣ **모델 크기에 따른 영향**: BERT base, large 두 가지 크기 실험
더 큰 규모의 모델이 실험한 네 가지 모든 데이터셋에서 더 좋은 성능을 내었다 ⇒
기존 연구와 다른 결과로, 이는 적절한 사전 학습 방식과 downstream태스크에서의 직접적인 파인튜닝으로 인한 것이라고 분석했다

> 3️⃣ **Feature-based 접근법에서의 성능**:  NER 태스크인 CoNLL 벤치마크로, BERT의 파라미터는 고정하고 파인튜닝시 추가된 레이어만을 학습하였다.
태스크에 맞게 붙인 classification layer의 파라미터 만을 튜닝하는 방법에서도 SOTA 모델과 유사한 성능을 보일 수 있음을 확인했다

## Paper

### 1. Effect of Pre-training Tasks

> BERT의 사전학습 objective 두 개를 제거한 뒤, MNLI-m, QNLI, MRPC, SST-2, SQuAD 태스크에서 평가하여 objective들 → BERT의 양방향성의 중요성을 설명했다

![Untitled](/assets/images/0829/Untitled.png)

1️⃣ **No NSP**

> MLM 태스크는 사용하지만, NSP 태스크로는 학습하지 않는 경우

NSP 제거 → QNLI, MNLI, SQuAD 1.1에서 성능이 저하됐다

2️⃣ **LTR & No NSP + BiLSTM**

> Left-context-only 모델. 사전학습과 파인튜닝 과정에서 표준적인 left-to-right 언어 모델 방식으로 학습했다

- 사전학습 & 파인튜닝 모두에서 LTR로 한 이유: pre-train/fine-tune이 매칭되지 않아 발생하는 성능 저하를 막기 위해서!
- → GPT와 직접 비교할 수 있음: 학습 데이터셋과 인풋 표현, 파인튜닝 방식의 차이
- 양방향 표현을 학습시키는 것의 중요성을 평가했다
    - 모든 태스크에서 LTR보다 MLM의 성능이 더 좋았다
- SQuAD에서 특히나 성능 저하가 심했는데, 이는 토큰 단위로 예측을 할 때 각 토큰에 대한 표현이 토큰 오른쪽의 맥락을 담지 못하기 때문이라고 분석했다
- 랜덤하게 초기화된 BiLSTM을 LTR 결과에 얹어 SQuAD에서의 성능을 개선시켰음에도, BERT와 성능 차이가 컸다
    - 오히려 GLUE 태스크에서는 BiLSTM을 붙인 것의 성능이 낮아졌다

- ELMo의 접근법처럼, LTR과 RTL 모델들을 따로 학습시킨 뒤, 각 토큰의 representation을 두 모델들로부터의 토큰 representation을 합치는 방법 또한 고려했지만..
    1. 하나의 bidirectional model을 학습시키는 것보다 더 비용이 비싸고
    2. QA와 같은 태스크에서는 intuitive하지 않다
        - RTL 모델이 answer를 question에 condition 하지 못할 것이므로..
    3. 깊게 쌓은 양방향 모델보다 훨씬 약한데, deep bidirectional 모델은 모든 레이어에서 왼쪽과 오른쪽 맥락을 다 알 수 있기 때문이다

### 2. Effect of Model Size

> 레이어 수, 히든 unit 수, attention head 수 조정 → 모델의 크기가 커질수록 모든 태스크에서 성능 향상 ← downstream task에서 직접 파인튜닝 되기 때문으로 판단

![Untitled](/assets/images/0829/Untitled%201.png)

- 그 결과, 더 큰 모델일수록 모든 태스크에서 더 좋은 성능을 보였다 ⇒ 기존 연구와 다른 결과로, 모델이 적절하게 사전학습 된다면 랜덤하게 초기화되는 추가 파라미터가 최소화 됨 ⇒ 크기를 키우는 것이 작은 규모의 태스크에서 성능을 크게 향상시키는 데에 도움이 된다는 것을 보였다!
    - 데이터가 작고 사전 학습 태스크와도 꽤 차이가 나는 MRPC 태스크에서도 같은 추이를 보였다
- vs. 기존 연구 (feature-based):
    - Peters et al. (2018): bi-LM 모델 크기를 변경하며 실험. downstream 태스크마다 결과가 달랐음
    - Melamud et al. (2016): 200 → 600까지는 도움 됐지만, 1000이상 올리면 더이상 성능 향상 되지 않았음

⇒ 모델이 downstream task에서 **직접 fine tuning** 되고, 적절하게 사전학습 된 파라미터로 , fine tuning할 데이터가 적더라도! 사전학습된 representation에서 더 도움을 받을 수 있다고 분석할 수 있다

### 3. Feature-based Approach with BERT

> BERT의 전체 파라미터를 fine-tuning하지 않고, 추가된 레이어의 파라미터 만을 학습하였다. 파라미터를 고정시킨 BERT에서 추출한 feature들을 다양한 방법으로 조합해 CoNLL 태스크에서 실험한 결과 모델 전체를 학습하지 않아도 좋은 성능을 보임을 확인했다

- 다른 실험에서는 BERT의 파라미터 전체를 파인튜닝했지만, feature-based approach에서는 사전학습된 모델을 고정하고 실험했다

**Why feature-based?**

이 실험을 한 이유

1. 모든 태스크들이 트랜스포머 인코더 구조만으로 표현되기 쉽지는 않으므로, 파인튜닝 할 때에는 태스크 마다 특별한 모델 구조가 추가 될 수 있다
2. 학습 데이터의 표현들을 계산하는 작업이 비싸기 때문에, BERT의 파라미터를 고정해 계산을 미리 하여 추출된 representation을 사용하면 더 효율적으로 많은 실험을 돌릴 수 있게 된다

**실험**

> CONLL-2003 개체명 인식 태스크로 실험을 진행하고, 대소문자를 유지한 WordPiece 모델을 사용해 BERT 입력을 만들었다

- 기존 방법들을 따라, tagging 태스크로 문제를 풀었다
    - 차이점: CRF레이어를 붙이지는 않았다
        - CRF

            **양방향 LSTM과 CRF (BiLSTM + CRF)**

            ### CRF (Conditional Random Field)

            - Many-to-many. 품사 판별 과제 등에서 사용된다
                - RNN 이전에 다른 모델들보다 좋은 성능을 보인다고 알려진 모델
                - 예측값을 그래픽 모델로 모델링해서, 예측값들 사이의 의존관계를 표현함
                - 구성하기에 따라, 얼마든지 hidden Markov model 같은 구조로 바꿀 수 있다
                - 시퀀스 분류기
                - 가능성이 있는 시퀀스 후보를 선택하고, 가장 적합한 하나의 라벨을 고른다

                ![Untitled](/assets/images/0829/Untitled%202.png)

                ![Untitled](/assets/images/0829/Untitled%203.png)

            - 원래 독자적으로 존재하던 모델인데, 양방향 LSTM 위에 추가하여 사용되었음
            - [https://ratsgo.github.io/machine learning/2017/11/10/CRF/](https://ratsgo.github.io/machine%20learning/2017/11/10/CRF/)

            - **BiLSTM** 만을 사용하는 예시

                ![Untitled](/assets/images/0829/Untitled%204.png)

                - BIO 표현법이 틀리다..!
            - **CRF 층을 위에 추가하면**

                활성화 함수를 지난 시점의 결과들이 CRF 층의 입력으로 전달되어, 레이블 시퀀스에 대해 가장 높은 점수를 갖는 시퀀스 예측

                ![Untitled](/assets/images/0829/Untitled%205.png)

                - LSTM이 입력 단어에 대한 양방향 문맥 반영
                - CRF가 출력 레이블에 대한 양방향 문맥 반영

    - 예측할 token마다 첫번째 sub-token의 표현을 사용해 토큰 단위 분류기의 입력으로 사용했다
- 한 개 이상의 레이어들에서 activation을 추출한, contextual embedding들
    - ⇒ 랜덤하게 초기화된 두개로 쌓은 768차원의 BiLSTM의 입력으로 사용
    - ⇒ 그 결과가 classification layer를 거치도록 했다

**결과**

> Fine-tuning 방법으로 했을 때 vs Feature-based로 했을 때 dev 데이터셋에서의 성능을 비교했다

![Untitled](/assets/images/0829/Untitled%206.png)

- BERT Large 모델을 사용해 fine tuning 했을 때 당시 SOTA 모델과 유사한 성능을 달성했고,
- 사전학습된 트랜스포머 모델의 맨 위 4개 hidden layer의 토큰 표현들을 합친 방법이 모델 전체를 finetuning 한 것과 가장 유사했다
- ⇒ BERT는 finetuning 뿐만 아니라, feature 기반의 접근법에도 효율적임을 보였다
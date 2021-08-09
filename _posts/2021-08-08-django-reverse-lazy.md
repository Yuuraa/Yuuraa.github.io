---
title: "Django의 reverse_lazy vs. reverse" 
date: 2021-08-08 22:34:30 -0400
categories: djange reverse_lazy Python
---

### Django urls의 함수들
- Django에서는 url을 편안하게 사용할 수 있는 기능을 제공한다

- Template의 url 태그와 비슷한 역할을 하며, url을 resolve 해주는 함수로 reverse, reverse_lazy 등이 있다

<br/>


### reverse
reverse 함수는 Template의 url 태그와 비슷한 역할을 한다. 

주어진 view와 파라미터들을 사용해 매칭되는 절대 참조 경로를 반환하는데, 아래와 같이 사용한다.

<img src="/assets/images/django/how to use reverse.png">


viewname으로는 urls.py에서 정의한 이름을 사용할 수도 있고, view 객체를 사용할 수도 있다

<img src="/assets/images/django/urls and views.png">

<br/>


### reverse_lazy
reverse를 lazy 하게 구현한 버전이다. 

도큐먼트에서는,

reverse를 사용한 url 반환이 URLConf 설정값이 로딩되기 전에 필요해지는 경우, 즉 파이썬 코드가 evaluate 되는 때에 함수가 호출되어 에러가 나는 것을 막아야 할 때 사용한다고 설명한다
1. 클래스를 기반으로 view를 선언했을 때, reverse 된 URL을 클래스의 url attribute으로 사용하는 경우
2. Reversed URL을 데코레이터에 사용하는 경우
3. Reversed URL을 함수의 기본 인자에 사용하는 경우


<br/>

### 언제 reverse_lazy를 사용하면 좋을까?
위처럼 보면 이해가 잘 가지 않는데, ```views.py``` 에서 클래스를 사용해 View를 사용하고, view의 작업이 성공했을 때 url을 반환할 때 사용하는 경우, 즉 위의 1번 경우를 예시로 들어보자

- Class 내부에서 변수로 url 반환 값을 선언하고자 할 때에는 ```reverse_lazy```를 사용하고
- Class 함수 내부, 또는 함수 내부에서 url 값을 선언하고자 할 때에는 ```reverse```를 사용한다

이렇게 하는 이유는 파이썬에서 클래스를 evaluate하는 순서와 관련이 있다.

클래스 변수를 선언하게 되면, 이는 클래스가 포함된 파일 또는 클래스를 import 할 때에도 evaluate 된다

이 때 이 url 관련 변수를 ```reverse```를 통해 선언하게 되면, 쟝고가 실행되면서 코드를 evaluate할 때 해당 값을 setting


쟝고가 reverse, reverse_lazy등을 사용해 url 절대 경로를 찾을 때에는 settings.py를 통해 초기화된 URLConf 설정값을 참고한다.

따라서 만약 import된 클래스 내부의 url 변수를 reverse로 찾는다면, 쟝고가 실행되기 위해 Python으로 작성된 코드를 evaluate 하는 과정에서 url을 찾는 작업을 하게 된다.
이 때는 settings.py가 초기화 되지 않은 상태이므로 url을 찾지 못하는 오류가 발생한다



ex)

<img src="/assets/images/django/reverse_error.png">



발생하는 오류의 모습 일부는 아래와 같다
```
Exception in thread django-main-thread:
Traceback (most recent call last):
  File "/usr/local/lib/python3.9/site-packages/django/urls/resolvers.py", line 600, in url_patterns
    iter(patterns)
TypeError: 'module' object is not iterable
...
raise ImproperlyConfigured(msg.format(name=self.urlconf_name)) from e
django.core.exceptions.ImproperlyConfigured: The included URLconf 'sampleapp.urls' does not appear to have any patterns in it. If you see valid patterns in the file then the issue is probably caused by a circular import.
```
위오 같은 오류가 나는 이유는 UrlConf의 urls.py에서 정의된 url들이 아직 초기화 되지(로딩 되지) 않았기 때문이다!


이 문제를 해결해주는 것이 ```reverse_url``` 으로, 클래스 내 url 변수로 선언하는 경우에는 reverse_url을 사용하는 것이 좋다. 

쟝고의 특정 view에서 작업이 성공했을 때 이동할 url을 지정해주는 경우를 예로 들어 보면, 아래와 같이 할 때 오류가 나지 않는다

<img src="/assets/images/django/reverse_lazy_good.png">



Decorator에서 사용하는 경우와 함수 기본 인자에서 사용하는 경우 또한 같은 이유일 것으로 추측된다!
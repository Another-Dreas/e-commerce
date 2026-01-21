class A:
    def show(self):
        print("ini adalah partisi A")
class B(A):
    def show(self):
        print("ini adalah partisi B")
class C(A):
    def show(self):
        print("ini adalah partisi C")
class D(B,C):
    pass

objek = D()
objek.show()
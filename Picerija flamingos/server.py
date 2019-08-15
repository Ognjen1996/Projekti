import socket
import time
from tkinter import *
from tkinter import font
from threading import Thread
import random
import threading

# zahtev = ""

vremeP = 0
lista = []
lista2 = []


class VremeNit:
    @staticmethod
    def run(zahtev, vreme, brojac):
        while 1:
            while vreme > 0:
                try:
                    time.sleep(1)
                    porudzbina = zahtev + ", Vreme isporuke: " + str(vreme)
                    if brojac == 1:
                        lab1["text"] = porudzbina
                    elif brojac == 2:
                        lab2["text"] = porudzbina
                    elif brojac == 3:
                        lab3["text"] = porudzbina
                    elif brojac == 4:
                        lab4["text"] = porudzbina
                    elif brojac == 5:
                        lab5["text"] = porudzbina
                except Exception as e:
                    print("Greska VremeNit " + str(e))
                vreme -= 1
                if vreme < 1:
                    print("GOTOVO!")
                    if brojac == 1:
                        lab1["text"] = ""
                    elif brojac == 2:
                        lab2["text"] = ""
                    elif brojac == 3:
                        lab3["text"] = ""
                    elif brojac == 4:
                        lab4["text"] = ""
                    elif brojac == 5:
                        lab5["text"] = ""
                    lista2.append(zahtev)
                    isporucene.delete(0, END)
                    for j in range(0, len(lista2)):
                        isporucene.insert(brojac, lista2[j])
                    print("***lista2***")
                    for i in range(0, len(lista2)):
                        print(lista2[i])
                    break


class ServerNit:
    clientCounter = 0
    @staticmethod
    def run(s):
        try:
            while True:
                conn, addr = s.accept()
                print("%s:%s has connected." % addr)
                ServerNit.clientCounter += 1
                brojac = ServerNit.clientCounter
                zahtev = str(ServerNit.clientCounter) + " - " + conn.recv(1024).decode()
                vreme = random.randint(1, 50)
                odgovor = "Biće gotovo tek za %d min!" % vreme
                conn.send(odgovor.encode())
                Thread(target=VremeNit.run, args=(zahtev, vreme, brojac)).start()
                conn.close()
        except Exception as e:
            print("Greska ServerNit " + str(e))


class Server:
    port = 12345
    host = socket.gethostname()

    @staticmethod
    def run():
        try:
            s = socket.socket()
            s.bind((Server.host, Server.port))
            s.listen(5)
            print("Server running...")
            while True:
                sN1 = ServerNit()
                sN1nit = Thread(target=sN1.run, args=(s,))
                sN1nit.start()
                sN1nit.join()
        except Exception as e:
            print("Greska Server " + str(e))


if __name__ == "__main__":
    root = Tk()
    root.title("Porudžbine")
    root.geometry("650x550")
    root.resizable(False, False)
    fOstalo = font.Font(family="Verdana", size=15, weight="bold")
    l_prvi = Label(root, text="Neisporučene: ", font=fOstalo, fg="pink")
    l_prvi.pack(anchor = NW)
    lab1 = Label(root, text="")
    lab1.pack(anchor = NW)
    lab2 = Label(root, text="")
    lab2.pack(anchor = NW)
    lab3 = Label(root, text="")
    lab3.pack(anchor = NW)
    lab4 = Label(root, text="")
    lab4.pack(anchor = NW)
    lab5 = Label(root, text="")
    lab5.pack(anchor = NW)
    l_drugi = Label(root, text="Isporučene: ", font=fOstalo, fg="pink")
    l_drugi.pack(anchor = NW)
    isporucene = Listbox(root, width=100)
    isporucene.pack(anchor = NE)
    s1 = Server()
    Thread(target=s1.run).start()
    root.mainloop()

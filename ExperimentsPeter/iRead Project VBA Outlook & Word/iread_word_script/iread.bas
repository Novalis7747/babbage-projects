Attribute VB_Name = "NewMacros"
Sub iRead()

' From the Desktop, right-click My Computer and click Properties
' Click Advanced System Settings link in the left column
' In the System Properties window click the Environment Variables button
' Use the Windows USER PATH variable to declare the iRead program folder
' Use the name IREAD as the variable name

Dim strIread As String
strIread = Environ("iread") & "\iRead.bat"

' Shell command

Shell strIread, vbHide

End Sub
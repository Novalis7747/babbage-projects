function Show-Menu
{
    param (
        [string]$Title = "Windows Server 2016 Back-up."
    )
    cls
    Write-Host "$Title"
    Write-Host "----------------------------"
    Write-Host ""
    Write-Host "1: Connect to server. (IP: 192.168.11.200)."
    Write-Host "2: Get datastore from server."
    Write-Host "3: Map root of datastore to PSDrive 'x:'."
    Write-Host "4: Copy entire Windows 2016 folder to back-up destination."
    Write-Host ""
    Write-Host "----------------------------"
    Write-Host ""
    Write-Host "5: Configure PowerCLI to ignore invalid certificates."
    Write-Host "6: Disable user participation program."
    Write-Host "7: Get Execution Policy."
    Write-Host ""
    Write-Host "----------------------------"
    Write-Host ""
    Write-Host "8: Find-Module PowerCLI"
    Write-Host "9: Install-Module PowerCLI"
    Write-Host ""
    Write-Host "----------------------------"
    Write-Host ""
    Write-Host "q: Press 'q' to quit."
    Write-Host ""
}

do
{
    Show-Menu
    $input = Read-Host "Please make a selection"
    switch ($input)
    {
        "1" {
            Write-Host "Connect-VIServer -Server 192.168.11.200"
            Connect-VIServer -Server 192.168.11.200
        } "2" {
            Write-Host '$datastore = Get-Datastore "datastore1"'
            $datastore = Get-Datastore "datastore1"
        } "3" {
            Write-Host 'New-PSDrive -Location $datastore -Name ds -PSProvider VimDatastore -Root "\"'
            New-PSDrive -Location $datastore -Name x -PSProvider VimDatastore -Root "\"
        } "4" {
            Write-Host "Copy-DatastoreItem -Item x:\windows_server_2016_std_16_core_oem\*.* -Destination 'b:\VMImages\Back-ups\HPE\windows_server_2016_std_16_core_oem'"
            Copy-DatastoreItem -Item x:\windows_server_2016_std_16_core_oem\*.* -Destination 'b:\VMImages\Back-ups\HPE\windows_server_2016_std_16_core_oem'
        } "5" {
            Write-Host "Set-PowerCLIConfiguration -InvalidCertificateAction ignore -confirm:$false"
            Set-PowerCLIConfiguration -InvalidCertificateAction ignore -confirm:$false
        } "6" {
            Write-Host "Set-PowerCLIConfiguration -Scope User -ParticipateInCEIP $false"
            Set-PowerCLIConfiguration -Scope User -ParticipateInCEIP $false
        } "7" {
            Write-Host "Get-ExecutionPolicy -List"
            Get-ExecutionPolicy -List
        } "8" {
            Write-Host "Find-Module -Name VMware.PowerCLI"
            Find-Module -Name VMware.PowerCLI
        } "9" {
            Write-Host "Install-Module -Name VMware.PowerCLI –Scope CurrentUser"
            Install-Module -Name VMware.PowerCLI –Scope CurrentUser
        } "q" {
            return
        }
    }
    Write-Host ""
    pause
}
until ($input -eq "q")

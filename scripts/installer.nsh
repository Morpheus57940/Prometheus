; Prometheus Installer customization
; © 2026 Morpheus

!macro customHeader
  !system "echo Prometheus v6.4 Setup > NUL"
!macroend

!macro customInstall
  ; Créer dossier de données utilisateur
  CreateDirectory "$APPDATA\Prometheus"
!macroend

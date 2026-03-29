#include <windows.h>
#include <stdio.h>
#include "nvml.h"

// ============================================================================
// 1. DEFINIÇÕES DE IDs E TIPOS DE FUNÇÕES (Mapeamento da DLL)
// ============================================================================
#define ID_CHECKBOX_TOP 101

typedef nvmlReturn_t (*f_nvmlInit)(void);
typedef nvmlReturn_t (*f_nvmlDeviceGetHandleByIndex)(unsigned int, nvmlDevice_t *);
typedef nvmlReturn_t (*f_nvmlDeviceGetMemoryInfo)(nvmlDevice_t, nvmlMemory_t *);
typedef nvmlReturn_t (*f_nvmlDeviceGetUtilizationRates)(nvmlDevice_t, nvmlUtilization_t *);
typedef nvmlReturn_t (*f_nvmlDeviceGetName)(nvmlDevice_t, char *, unsigned int);
typedef nvmlReturn_t (*f_nvmlDeviceGetClockInfo)(nvmlDevice_t, int, unsigned int *);
typedef nvmlReturn_t (*f_nvmlDeviceGetTemperature)(nvmlDevice_t, int, unsigned int *);
typedef nvmlReturn_t (*f_nvmlDeviceGetPowerUsage)(nvmlDevice_t, unsigned int *);

// ============================================================================
// 2. VARIÁVEIS GLOBAIS
// ============================================================================
f_nvmlDeviceGetMemoryInfo       g_getMem;
f_nvmlDeviceGetUtilizationRates  g_getUtil;
f_nvmlDeviceGetClockInfo         g_getClock;
f_nvmlDeviceGetTemperature      g_getTemp;
f_nvmlDeviceGetPowerUsage       g_getPower; 
nvmlDevice_t                    g_device;

HWND     g_hLabelData;
HWND     g_hCheckTop;
HBRUSH   g_hBrushBack;

char     g_gpuName[256] = "Buscando GPU..."; 
int      g_monLargura = 0, g_monAltura = 0, g_monHz = 0;
unsigned int g_currentUsage = 0;

// ============================================================================
// 3. LÓGICA DE ATUALIZAÇÃO DOS DADOS (SENSORES)
// ============================================================================
void AtualizarDados() {
    nvmlMemory_t mem;
    nvmlUtilization_t util;
    unsigned int clockMHz = 0, tempC = 0, powerMW = 0;
    char buffer[512];

    if (!g_getMem || !g_getUtil || !g_getClock || !g_getTemp || !g_getPower) return;

    g_getMem(g_device, &mem);
    g_getUtil(g_device, &util);
    g_getClock(g_device, 0, &clockMHz); // 0 = Clock do Núcleo
    g_getTemp(g_device, 0, &tempC);    // 0 = Temperatura do Núcleo
    g_getPower(g_device, &powerMW);    // Consumo em miliwatts
    
    g_currentUsage = util.gpu;

    // Formatação: Watts agora aparece após o Clock
    sprintf(buffer, "%s\nUso: %u%% | Temp: %u C\nClock: %u MHz | %u W\nVRAM: %llu/%llu MB\nMonitor: %dx%d @ %dHz", 
            g_gpuName, 
            g_currentUsage, 
            tempC,
            clockMHz, 
            powerMW / 1000, // Conversão de mW para W
            mem.used/1024/1024, 
            mem.total/1024/1024, 
            g_monLargura, g_monAltura, g_monHz);
    
    SetWindowTextA(g_hLabelData, buffer);
    InvalidateRect(g_hLabelData, NULL, TRUE);
}

// ============================================================================
// 4. PROCEDIMENTO DA JANELA (Eventos e Interface)
// ============================================================================
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_CREATE:
            g_hBrushBack = CreateSolidBrush(GetSysColor(COLOR_WINDOW));
            g_hLabelData = CreateWindowA("STATIC", "Lendo sensores...", 
                                        WS_VISIBLE | WS_CHILD | SS_CENTER, 
                                        10, 10, 280, 110, hwnd, NULL, NULL, NULL);
            
            g_hCheckTop = CreateWindowA("BUTTON", "Manter acima das janelas", 
                                       WS_VISIBLE | WS_CHILD | BS_AUTOCHECKBOX, 
                                       60, 125, 200, 20, hwnd, (HMENU)ID_CHECKBOX_TOP, NULL, NULL);
            SendMessage(g_hCheckTop, BM_SETCHECK, BST_CHECKED, 0);

            CreateWindowA("STATIC", "Criado em C, com IA, por Ieso Nagata", 
                         WS_VISIBLE | WS_CHILD | SS_CENTER, 
                         10, 165, 280, 20, hwnd, NULL, NULL, NULL);

            SetTimer(hwnd, 1, 1000, NULL);
            return 0;

        case WM_CTLCOLORSTATIC: {
            HDC hdcStatic = (HDC)wParam;
            if ((HWND)lParam == g_hLabelData) {
                if (g_currentUsage < 30)      SetTextColor(hdcStatic, RGB(0, 150, 0));
                else if (g_currentUsage < 75) SetTextColor(hdcStatic, RGB(255, 140, 0));
                else                          SetTextColor(hdcStatic, RGB(200, 0, 0));
                SetBkColor(hdcStatic, GetSysColor(COLOR_WINDOW));
                return (LRESULT)g_hBrushBack;
            }
            return (LRESULT)g_hBrushBack;
        }

        case WM_COMMAND:
            if (LOWORD(wParam) == ID_CHECKBOX_TOP) {
                if (SendMessage(g_hCheckTop, BM_GETCHECK, 0, 0) == BST_CHECKED)
                    SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
                else
                    SetWindowPos(hwnd, HWND_NOTOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
            }
            return 0;

        case WM_TIMER: AtualizarDados(); return 0;
        case WM_DESTROY: DeleteObject(g_hBrushBack); PostQuitMessage(0); return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

// ============================================================================
// 5. FUNÇÃO PRINCIPAL (WinMain)
// ============================================================================
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrev, LPSTR lpCmd, int nShow) {
    HMODULE hNvml = LoadLibraryA("nvml.dll");
    if (!hNvml) return 1;

    f_nvmlInit nvmlInit = (f_nvmlInit)GetProcAddress(hNvml, "nvmlInit");
    f_nvmlDeviceGetHandleByIndex getHandle = (f_nvmlDeviceGetHandleByIndex)GetProcAddress(hNvml, "nvmlDeviceGetHandleByIndex");
    f_nvmlDeviceGetName getName = (f_nvmlDeviceGetName)GetProcAddress(hNvml, "nvmlDeviceGetName");
    g_getMem = (f_nvmlDeviceGetMemoryInfo)GetProcAddress(hNvml, "nvmlDeviceGetMemoryInfo");
    g_getUtil = (f_nvmlDeviceGetUtilizationRates)GetProcAddress(hNvml, "nvmlDeviceGetUtilizationRates");
    g_getClock = (f_nvmlDeviceGetClockInfo)GetProcAddress(hNvml, "nvmlDeviceGetClockInfo");
    g_getTemp = (f_nvmlDeviceGetTemperature)GetProcAddress(hNvml, "nvmlDeviceGetTemperature");
    g_getPower = (f_nvmlDeviceGetPowerUsage)GetProcAddress(hNvml, "nvmlDeviceGetPowerUsage");

    if (nvmlInit() == NVML_SUCCESS) {
        getHandle(0, &g_device);
        getName(g_device, g_gpuName, 256);
    }

    g_monLargura = GetSystemMetrics(SM_CXSCREEN);
    g_monAltura  = GetSystemMetrics(SM_CYSCREEN);
    DEVMODEA dm;
    dm.dmSize = sizeof(dm);
    if (EnumDisplaySettingsA(NULL, ENUM_CURRENT_SETTINGS, &dm)) {
        g_monHz = dm.dmDisplayFrequency;
    }

    WNDCLASSA wc = {0};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "MonitorGPU_Ieso";
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    RegisterClassA(&wc);

    int largJanela = 320, altJanela = 240, margem = 20;
    RECT areaUtil;
    SystemParametersInfo(SPI_GETWORKAREA, 0, &areaUtil, 0);
    int posX = areaUtil.right - largJanela - margem;
    int posY = areaUtil.top + margem;

    HWND hwnd = CreateWindowExA(WS_EX_TOPMOST, "MonitorGPU_Ieso", "Monitor IA", 
                               WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
                               posX, posY, largJanela, altJanela, NULL, NULL, hInstance, NULL);

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) { TranslateMessage(&msg); DispatchMessage(&msg); }
    FreeLibrary(hNvml);
    return 0;
}

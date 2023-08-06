<template>
  <q-card v-if="itemData" style="max-width: 1200px; width: 80vw;">
    <q-card-section style="position: sticky; top: 0; background: white; z-index: 99;">
      <div class="text-h6">Row No. {{ itemData.itemId }} /
        <span v-if="itemData.newAssetCode"> New Asset Code: {{ itemData.newAssetCode }}</span>
        <span v-else>New Asset Code: none</span>
      </div>
    </q-card-section>

    <div style="max-height: 70vh;" class="scroll">
      <div ref="dialogueTop"></div>
      <div style="display: grid; grid-template-columns: 8fr 4fr;">
        <q-card-section class="q-pt-none" style="position: unset !important;">
          <q-form
            class="q-gutter-md"
          >

            <q-input
              dense
              filled
              v-model.trim="itemData.genericName"
              label="GENERIC NAME"
              hint="Required max 255 characters"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Type item name']"
              maxlength="255"
              counter
            />

            <q-select
              dense
              filled
              v-model="itemData.deptCode"
              input-debounce="900"
              label="DEPARTMENT"
              hint="Required"
              :options="deptList"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Select a department']"
              :disable="deptChange"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              dense
              filled
              v-model="itemData.categoryCode"
              input-debounce="900"
              label="CATEGORY"
              hint="Required"
              :options="catList"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Select a category']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!--
              hint="Required"
              lazy-rules
              :rules="[ val => val && val >= 1.00 || 'Enter an amount']"
            -->
            <q-input
              filled
              dense
              v-model="itemData.unitCost"
              label="UNIT COST (php)"
              prefix="₱"
              type="number"
              input-class="text-right"
              style="max-width: 200px"
              step="0.01"
              min="0"
              :rules="[ val => val && val >= 0 || 'Minimum of 0']"
            />

            <q-input
              filled
              dense
              v-model="itemData.dateReceived"
              label="Date Received"
              type="date"
              style="max-width: 200px"
            />

            <q-select
              dense
              filled
              v-model="itemData.setNo"
              use-input
              input-debounce="900"
              label="Set No."
              :options="setIdOptions"
              @filter="filterSetId"
              style="max-width: 200px"
              emit-value
              map-options
              lazy-rules
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              dense
              filled
              v-model.trim="itemData.itemCode"
              label="Item code"
              maxlength="6"
              counter
              hint="max 6 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.receivingReport"
              label="RR No."
              maxlength="10"
              counter
              hint="max 10 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.supplierName"
              label="Supplier name"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.purchaseOrderNo"
              label="PO number"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.invoiceNo"
              label="Invoice number"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.brandName"
              label="Brand"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.brandModel"
              label="Model"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.serialNo"
              label="Serial number"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.itemSpecs"
              label="Specification"
              maxlength="1000"
              counter
              hint="max 1000 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.newAssetCode"
              label="New Asset Code"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.itemRemarks"
              label="Remarks"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model.trim="itemData.oldAssetCode"
              label="Old asset code"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              dense
              filled
              v-model="itemData.physicalLocation"
              label="Physical location"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <div class="q-gutter-sm flex items-center ats-checkbox">
              <q-checkbox
                v-model="itemData.condemned"
                color="primary"
                label="Condemned:"
                style="margin: 0;"
                :disable="condemnedChange"
              />
              <strong v-if="itemData.condemned" style="padding-bottom: 7px;"> &nbsp; Condemned</strong>
              <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Condemned</strong>
            </div>

            <div class="q-gutter-sm flex items-center ats-checkbox">
              <q-checkbox
                v-model="itemData.salvaged"
                color="primary"
                label="Salvaged Status:"
                style="margin: 0;"
              />
              <strong v-if="itemData.salvaged" style="padding-bottom: 7px;"> &nbsp; Salvaged</strong>
              <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Salvaged</strong>
            </div>

          </q-form>
        </q-card-section>

        <div style="padding-right: 20px;">
          <div class="flex items-center ats-checkbox" style="margin-top: 0;">
            <q-checkbox
              v-model="itemData.assetTagStatus"
              color="primary"
              label="Asset Tag Status:"
              style="margin: 0;"
            />
            <strong v-if="itemData.assetTagStatus"> &nbsp; Tagged</strong>
            <strong v-else> &nbsp; Untagged</strong>
          </div>
          <div v-if="itemHistory.length > 0" style="margin-top: 20px;">
            <div style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">Department Transfer History</div>
            <div v-for="item of itemHistory" v-bind:key="item.activity" style="background: rgba(0, 0, 0, 0.05); margin: 10px 0; padding: 10px; border-radius: 4px;">
              {{ item.activity }} / {{ format_date(item.tStamp) }} / {{ format_time(item.tStamp) }} <br>
              <strong>Department From:</strong> {{ item.deptFrom }} <br> <strong>Department To:</strong> {{ item.deptTo }} <br>
              {{ item.authorName }} / {{ item.authorCode }}
            </div>
          </div>
          <div v-else style="margin-top: 20px;">
            <div style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">No Transfer History</div>
          </div>
        </div>
      </div>
    </div>
    <!-- align="right" -->
    <q-card-actions style="position: sticky; bottom: 0; background: #FFFFFF; z-index: 99; margin-right: 20px; padding-bottom: 20px; display: flex; justify-content: space-between;">
      <div>
        <q-btn color="amber" label="CLOSE" v-close-popup style="margin-left: 10px;" />
        <q-btn color="positive" label="SUBMIT CHANGES" v-close-popup @click="updateItem" style="margin-left: 20px;" />
        <q-btn v-if="deleteBtn" color="negative" label="DELETE" @click="deleteDialog" style="margin-left: 20px;" />
      </div>
      <q-btn label="SCROLL TO TOP" @click="this.scrollToTop()" />
    </q-card-actions>

    <!-- dialog / confirm deletion -->
    <q-dialog
      v-model="confirmDeleteDialog"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6 text-negative">Confirm Deletion</div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="deleteItem" v-close-popup />
          <q-btn flat label="CANCEL" style="color: #757575" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import setToken from 'src/helpers/setToken';
import fetchSelect from 'src/helpers/fetchSelect';
import moment from 'moment';
import { diff } from 'deep-diff';

export default defineComponent ({
  props: ['id', 'departments', 'categories'],
  data() {
    return {
      loading: false,
      oldItem: null,
      itemData: null,
      itemHistory: null,

      url: `${process.env.API_HOST}/api/itemlist`,
      setListUrl: `${process.env.API_HOST}/api/getSetNo`,
      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,
      itemId: this.id,

      deptList: this.departments,

      catList: this.categories,

      setIdList: null,
      setIdOptions: this.setIdList,

      deptChange: false,
      condemnedChange: false,

      deleteBtn: false,
      confirmDeleteDialog: false,
    }
  },
  methods: {
    scrollToTop() {
      this.$refs['dialogueTop'].scrollIntoView({ behavior: "smooth" });
    },
    format_date(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('YYYY-MM-DD');
      }
    },
    format_time(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('hh:mm A');
      }
    },
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    deleteDialog() {
      this.confirmDeleteDialog = true;
    },
    getItem: async function(id) {
      this.loading = true;
      const getItemsUrl = this.url;
      const token = this.token;
      await axios.get(`${getItemsUrl}/${id}`, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200 && res.data !== '') {
          this.oldItem = {...res.data.item[0]}
          this.itemData = res.data.item[0];
          this.itemHistory = res.data.itemHistory;

          if (res.data.item[0].dateReceived) {
            this.oldItem.dateReceived = this.format_date(this.oldItem.dateReceived);
            this.itemData.dateReceived = this.format_date(this.itemData.dateReceived);
          }
        } else {
          this.warning('Failed to get data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
    updateItem: async function() {
      const putBody = JSON.parse(JSON.stringify(this.itemData), (key, value) => {
        return value === '' || value === undefined ? null : value;
      });

      if (putBody.unitCost === null) {
        putBody.unitCost = 0;
      } else {
        putBody.unitCost = parseFloat(putBody.unitCost);
      }

      if(putBody.setNo == 0 || putBody.setNo == null) {
        putBody.setNo = null;
      }

      if (!diff(this.oldItem, putBody)) {
        this.$emit('dClose', false);
        return;
      }

      this.loading = true;
      const getItemsUrl = this.url;
      const token = this.token;

      await axios.put(getItemsUrl, { putBody }, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200) {
          this.itemData = res.data
        } else {
          this.warning('Failed to update data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
          window.location.reload(true);
        }, 900);
      })
    },
    deleteItem: async function() {
      const id = this.itemId;
      const getItemsUrl = this.url;
      const token = this.token;
      await axios.delete(`${getItemsUrl}/${id}`, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        window.location.reload(true);
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
    },
    filterSetId (val, update) {
      if (val === '') {
        update(() => {
          this.setIdOptions = this.setIdList
        })
        return
      }

      update(() => {
        const needle = val.toString().toLowerCase()
        this.setIdOptions = this.setIdList.filter(v => v.label.toString().toLowerCase().indexOf(needle) > -1)
      })
    },
    async fetchSetList() {
      this.setIdList = await fetchSelect.setIdList(this.setListUrl, this.token)
    },
    userCanDelete() {
      if (this.rights.includes('D')) {
        this.deleteBtn = true;
      }
    },
    applyWatchers() {
      this.$watch('itemData.deptCode', function(val, oldVal) {
        if (val !== oldVal) {
          this.condemnedChange = true;
        }
      });
      this.$watch('itemData.condemned', function(val, oldVal) {
        if (val !== oldVal) {
          this.deptChange = true;
        }
      });
    },
  },
  async mounted() {
    await this.fetchSetList();
    await this.getItem(this.itemId);

    await this.applyWatchers();
    this.userCanDelete();
  },
})
</script>

<style>
  .modal-table td:first-child, th:first-child {
    position: unset !important;
  }
</style>
